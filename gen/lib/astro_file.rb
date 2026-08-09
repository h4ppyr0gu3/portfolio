require 'json'

class AstroFile
  attr_reader :html, :metadata

  DEFAULT_METADATA = {
    published: false,
    title: nil,
    date: Time.now.strftime('%d/%m/%Y'),
    updated: Time.now.strftime('%d/%m/%Y')
  }.freeze

  def initialize(html:, metadata: DEFAULT_METADATA)
    @html = html
    @metadata = metadata.each_with_object({}) do |(k, v), result|
      result[k.to_sym] = v
    end
  end

  def create
    beginning_of_file(metadata) + html + end_of_file
  end

  def beginning_of_file(metadata) # rubocop:disable Metrics/MethodLength
    title = JSON.generate(metadata[:title].to_s)
    date = JSON.generate(metadata[:date].to_s)
    updated = JSON.generate(metadata[:updated].to_s)
    description = JSON.generate(metadata[:excerpt].to_s)
    <<~ASTRO
      ---
      import Blog from '../../layouts/Blog.astro';

      const title = #{title};
      const description = #{description};
      const date = #{date};
      const updated = #{updated};
      ---
      <Blog title={title} description={description} date={date} updated={updated}>
    ASTRO
  end

  def end_of_file
    "\n</Blog>\n"
  end
end
