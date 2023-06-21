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
GitlabAPIError = StandardError.new

def github_response(content) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  uri = URI.parse('https://api.github.com/markdown')
  params = { 'text' => content.to_s, 'mode' => 'markdown' }
  request = Net::HTTP::Post.new(uri)
  request['Accept'] = 'application/vnd.github+json'
  request['Authorization'] = "Bearer #{ENV['GITHUB_API_KEY']}"
  request['X-GitHub-Api-Version'] = '2022-11-28'

  request.body = params.to_json

  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
    http.request(request)
  end
  raise GithubAPIError unless response.code == '200'

  response.body
end

def gitlab_response(content) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  uri = URI.parse('https://gitlab.com/api/v4/markdown')
  params = { 'text' => content.to_s, 'gfm' => 'true' }
  request = Net::HTTP::Post.new(uri)
  request['Content-Type'] = 'application/json'
  request['PRIVATE-TOKEN'] = ENV['GITLAB_API_KEY'].to_s

  request.body = params.to_json

  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
    http.request(request)
  end
  raise GitlabAPIError unless response.code == '201'

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

  YAML.load(yaml).transform_keys(&:to_sym)
end

def beginning_of_file(title)
  "---
import Blog from '../../layouts/Blog.astro';
import '../../markdown.css';
---

  <Blog title='#{title}'>
  "
end

def end_of_file
  "\n</Blog>"
end

def output(metadata, content)
  title = metadata[:title]
  beginning_of_file(title) + content + end_of_file
end

Dir.glob("#{SOURCE_PATH}/**/*.md").each do |file|
pp file
end

Dir.glob("#{SOURCE_PATH}/**/*.md").each do |file|
  content = File.open(file).read
  parsed_file = Content.new(content)
  metadata = read_yaml(parsed_file.yaml)
  next if metadata.nil?
  ghhtml = github_response(parsed_file.markdown)
  glhtml = gitlab_response(parsed_file.markdown)
  file = file.gsub("#{SOURCE_PATH}/", '')
  gl_file = file.gsub('.md', '_gitlab.astro')
  gh_file = file.gsub('.md', '_github.astro')
  pp gl_file
  pp gh_file
  pp file
  File.write("#{OUTPUT_PATH}/#{gh_file}", output(metadata, ghhtml))
  File.write("#{OUTPUT_PATH}/#{gl_file}", output(metadata, glhtml['html']))
end
