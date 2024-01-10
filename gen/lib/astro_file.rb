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

  def beginning_of_file(metadata) # rubocop:disable
"---
import Blog from '../../layouts/Blog.astro';
---
<Blog title='#{metadata[:title]}' date='#{metadata[:date]}' updated='#{metadata[:updated]}'>\n"
  end # rubocop:enable

  def end_of_file
    "\n</Blog>"
  end
end
