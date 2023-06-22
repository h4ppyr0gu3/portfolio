class AstroFile
  attr_reader :html, :metadata

  DEFAULT_METADATA = {
    published: false,
    title: nil,
    date: Time.now.strftime('%d/%m/%Y')
  }.freeze

  def initialize(html:, metadata: DEFAULT_METADATA)
    @html = html
    @metadata = metadata.each_with_object({}) do |(k, v), result|
      result[k.to_sym] = v
    end
  end

  def create
    pp metadata
    pp html
    beginning_of_file(metadata) + html + end_of_file
  end

  def beginning_of_file(metadata)
    "---
    import Blog from '../../layouts/Blog.astro';
    ---

    <Blog title='#{metadata[:title]}'>
    "
  end

  def end_of_file
    "\n</Blog>"
  end
end
