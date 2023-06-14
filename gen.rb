#!/usr/bin/env ruby

# frozen_string_literal: true

require 'bundler/inline'
require 'net/http'
require 'uri'
require 'json'
require 'yaml'

SOURCE_PATH = './lib'
OUTPUT_PATH = './src/pages'

gemfile do
  source 'https://rubygems.org'

  gem 'dotenv'
  gem 'debug'
end

Dotenv.load

GithubAPIError = StandardError.new

def github_response(content) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  uri = URI.parse('https://api.github.com/markdown')
  params = { 'text' => content.to_s }
  request = Net::HTTP::Post.new(uri)
  request['Accept'] = 'application/vnd.github+json'
  request['Authorization'] = "Bearer #{ENV['GITHUB_API_KEY']}"
  request['X-GitHub-Api-Version'] = '2022-11-28'

  request.body = params.to_json

  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
    http.request(request)
  end
  raise GithubAPIError unless response.code == '200'

  JSON.parse(response.body)
end

# Parses the raw file and returns seperate yaml metadata and markdown content
class Content
  attr_reader :yaml, :markdown

  def initialize(content)
    @content = content
    lines = content.split("\n").drop(1)
    end_of_yaml = lines.index('---')
    if end_of_yaml.nil?
      @yaml = nil
      @markdown = nil
    else
      @yaml = lines[0..(end_of_yaml - 1)].join("\n")
      @markdown = lines[(end_of_yaml + 1)..].join("\n")
    end
  end
end

def read_yaml(yaml)
  return if yaml.nil?

  debugger
end

Dir.glob("#{SOURCE_PATH}/**/*.md").each do |file|
  content = File.open(file).read
  parsed_file = Content.new(content)
  read_yaml(parsed_file.yaml)
  file = file.gsub("#{SOURCE_PATH}/", '')
  # pp github_response(content) if file == 'blog/about_this_site.md'
  pp file
end
