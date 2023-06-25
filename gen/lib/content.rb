# Parses the raw file and returns seperate yaml metadata and markdown content
class Content
  GithubAPIError = StandardError.new
  GitlabAPIError = StandardError.new('Gitlab response error')
  attr_reader :yaml, :markdown, :file_markdown

  RAW_FORMATS = %w[rawhtml rawmath mermaid].freeze

  def initialize(content)
    @content = content
    lines = content.split("\n").drop(1)
    end_of_yaml = lines.index('---')
    if end_of_yaml.nil?
      @yaml = nil
      @markdown = nil
    else
      @yaml = lines[0..(end_of_yaml - 1)].join("\n")
      markdown_array = lines[(end_of_yaml + 1)..]
      @file_markdown = markdown_array.join("\n")
      @markdown = processed_markdown(markdown_array)
    end
  end

  def processed_markdown(markdown)
    @map = { rawhtml: [], rawmath: [], mermaid: [] }
    RAW_FORMATS.each do |x|
      count = 0
      start_index = markdown.index("```#{x}")
      until start_index.nil? || count > 4
        remaining_markdown = markdown[(start_index + 1)..]
        end_index = markdown[(start_index + 1)..].index('```')
        extract = markdown.slice!(start_index, (end_index + 2))
        @map[x.to_sym] << {
          index: count,
          lines: extract[1..-2],
          end_index:,
          match: "<pre>#{x}-entry-#{count}</pre>"
        }
        markdown.insert(start_index, "<pre>#{x}-entry-#{count}</pre>")
        count += 1
        start_index = markdown.index("```#{x}")
      end
    end
    markdown.join("\n")
  end

  def metadata
    read_yaml(yaml)
  end

  def html
    puts 'Generating html from gitlab...'
    # have to postprocess
    # github_response(markdown)
    html = gitlab_response(markdown)['html']
    postprocess_html(html)
  end

  def postprocess_html(html)
    html = html.split("\n")
    html = handle_html(html)
    # handle_math(html)
    html = handle_mermaid(html)
    html.join("\n")
  end

  private

  def handle_mermaid(html)
    @map[:mermaid].each do |obj|
      index = html.index(obj[:match])
      html.slice!(index, 1)
      html.insert(index, "<pre class='mermaid'>\n#{obj[:lines].join("\n")}\n</pre>")
    end
    html
  end

  def handle_html(html)
    @map[:rawhtml].each do |obj|
      index = html.index(obj[:match])
      html.slice!(index, 1)
      html.insert(index, obj[:lines].join("\n"))
    end
    html
  end

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

  def read_yaml(yaml)
    return if yaml.nil?

    YAML.load(yaml).transform_keys(&:to_sym)
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
end
