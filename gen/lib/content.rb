# Parses the raw file and returns seperate yaml metadata and markdown content
class Content
  GithubAPIError = StandardError.new
  GitlabAPIError = StandardError.new
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

  def metadata
    read_yaml(yaml)
  end

  def html
    # github_response(markdown)
    gitlab_response(markdown)['html']
  end

  private

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
