# frozen_string_literal: true

require 'dotenv'

require_relative './lib/content'
require_relative './lib/astro_file'
require_relative './lib/entry'

Dotenv.load
SOURCE_PATH = './lib'
OUTPUT_PATH = './src/pages'
JSON_FILE = './blogs.json'
SUPPORTED_PATHS = %w[til blog].freeze
ROOT = '/home/david/portfolio'

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
  entry.transform_keys(&:to_sym) != metadata
end

def handle_files # rubocop:disable Metrics/MethodLength
  Dir.glob("#{SOURCE_PATH}/**/*.md").each do |file|
    type = file.split('/')[2]
    next unless SUPPORTED_PATHS.include?(type)

    content = Content.new(File.open(file).read)
    metadata = build_metadata(file, content.metadata)
    json_entry = handle_metadata(type, metadata, file)
    next unless should_update_entry?(json_entry, metadata)

    puts "Generating #{file}"
    generate_file(file, content, metadata)
    update_original(file, content, metadata)
  end
end

def handle_metadata(type, metadata, file)
  json_entry = @data[type].select { |entry| entry['href'] == href(file) }.first
  json_index = @data[type].index { |entry| entry['href'] == href(file) }
  if json_index.nil?
    @data[type] << metadata
  else
    @data[type][json_index] = metadata
  end
  json_entry
end

def update_original(file, content, metadata)
  yaml_data = YAML.dump(metadata.transform_keys(&:to_s))
  File.write(file, "#{yaml_data}---\n#{content.file_markdown}")
end

def build_metadata(file, metadata) # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity
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
