# frozen_string_literal: true

class Entry
  attr_reader :href, :type

  def initialize(file, json)
    @type = file.split('/')[2]
    @href = href(file)
    @old_json = json[@type].select { |entry| entry['href'] == @href }.first
    @content = File.open(file).read
    @parsed_file = Content.new(@content)
    @metadata = read_yaml(@parsed_file)
  end

  def new_json
    return @old_json unless @old_json.nil? || @old_json[:updated] != metadata[:updated]
  end
end
