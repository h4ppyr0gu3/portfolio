class AiData
  attr_reader :excerpt, :tags

  def initialize(metadata, markdown)
    @markdown = markdown
    @metadata = metadata
    @tags = tags
    @excerpt = excerpt
  end

  def excerpt
    if @metadata[:excerpt].nil? || @metadata[:excerpt].empty?
      ai_response[:excerpt]
    else
      @metadata[:excerpt]
    end
  end

  def tags
    if @metadata[:tags].count < 5
      ai_response[:tags]
    else
      @metadata[:tags]
    end
  end

  def ai_response
    @ai_response ||= generate_ai_content
  end

  def generate_ai_content
    pp '...'
    pp 'asking the AI...'
    client = OpenAI::Client.new(access_token: ENV.fetch('OPENAI_API_KEY'))
    response = client.chat(
      parameters: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: "I will give you a paragraph, please give me an excerpt of up \
            to 200 charachters and 5 - 10 short tags that describe this paragraph, \
            paraphrasing is recommended. return a response in JSON format with only \
            the following keys: excerpt, and tags, where tags is an array and excerpt \
            is a string.\n Here is the Paragraph: #{@markdown}\n"
          }
        ]
      }
    )
    json_response = response.dig('choices', 0, 'message', 'content')
    JSON.parse(json_response).transform_keys { |x| x.downcase.to_sym }
  rescue StandardError
    puts "ERROR in AI response:\n\t#{response}"
  end
end
