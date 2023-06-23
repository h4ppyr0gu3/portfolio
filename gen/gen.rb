#!/usr/bin/env ruby

# frozen_string_literal: true

require 'bundler/inline'
require 'net/http'
require 'uri'
require 'json'
require 'yaml'
require_relative './lib/content'
require_relative './lib/astro_file'
require_relative './lib/entry'

SOURCE_PATH = './lib'
OUTPUT_PATH = './src/pages'
JSON_FILE = './blogs.json'
SUPPORTED_PATHS = %w[til blog].freeze
ROOT = '/home/david/portfolio'

gemfile do
  source 'https://rubygems.org'

  gem 'dotenv'
  gem 'debug'
end

Dotenv.load

pp ROOT

def read_json
  current_data = JSON.parse(File.read(JSON_FILE))
  SUPPORTED_PATHS.each { |path| current_data[path] = [] if current_data[path].nil? }
  current_data
end

def write_json
  File.write(JSON_FILE, JSON.pretty_generate(@data))
end

def href(file)
  file.gsub(SOURCE_PATH, '').gsub('.md', '')
end

def should_update_entry?(entry, metadata)
  return true if entry.nil?

  # check if metadata has changed
  entry == metadata
end

def handle_files
  Dir.glob("#{SOURCE_PATH}/**/*.md").each do |file|
    type = file.split('/')[2]
    next unless SUPPORTED_PATHS.include?(type)

    content = Content.new(File.open(file).read)
    metadata = content.metadata

    json_entry = @data[type].select { |entry| entry['href'] == href(file) }.first
    json_index = @data[type].index { |entry| entry['href'] == href(file) }
    metadata = build_metadata(file, content.metadata)
    if json_index.nil?
      @data[type] << metadata
    else
      @data[type][json_index] = metadata
    end
    generate_file(file, content, metadata) if should_update_entry?(json_entry, metadata)
    update_orginal(file, content, metadata)
  end
end

def update_original(file, content, metadata)
  File.write(file, YAML.dump(metadata) + "\n---\n" + content.markdown)
end

def build_metadata(file, metadata)
  metadata = {} if metadata.nil?
  {
    href: href(file),
    title: metadata[:title] || file.split('/').last.gsub('.md', '').gsub('_', ' '),
    excerpt: metadata[:excerpt] || '',
    date: metadata[:date] || Time.now.strftime('%d/%m/%Y'),
    tags: metadata[:tags] || [],
    published: metadata[:published] || false,
    updated: metadata[:updated] || Time.now.strftime('%d/%m/%Y')
  }
end

def generate_file(file, content, metadata)
  astro_output = AstroFile.new(html: content.html, metadata:).create
  path = file.split('/').drop(2).join('/').gsub('.md', '.astro')
  File.write("#{OUTPUT_PATH}/#{path}", astro_output)
end

def execute
  @data = read_json
  handle_files
  write_json
end

execute

# Dir.glob("#{SOURCE_PATH}/**/*.md").each do |file|
#   content = File.open(file).read
#   parsed_file = Content.new(content)
#   metadata = read_yaml(parsed_file.yaml)
#   metadata = build_metadata(metadata, file)
#   next if metadata.nil?

#   build_routes_json

#   # html = gitlab_response(parsed_file.markdown)
#   file = file.gsub("#{SOURCE_PATH}/", '')
#   file = file.gsub('.md', '.astro')
#   # File.write("#{OUTPUT_PATH}/#{file}", output(metadata, html['html']))
# end
