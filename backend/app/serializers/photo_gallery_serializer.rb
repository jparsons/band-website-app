class PhotoGallerySerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :cover_image_url, :position, :published

  has_many :photos

  def cover_image_url
    object.cover_image.attached? ? rails_blob_url(object.cover_image) : nil
  end

  private

  def rails_blob_url(blob)
    Rails.application.routes.url_helpers.rails_blob_url(blob, host: request_host)
  end

  def request_host
    if @instance_options[:request]
      "#{@instance_options[:request].protocol}#{@instance_options[:request].host_with_port}"
    else
      "#{Rails.env.production? ? 'https' : 'http'}://#{ENV['HOST'] || 'localhost:3000'}"
    end
  end
end
