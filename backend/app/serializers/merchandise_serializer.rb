class MerchandiseSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :price, :image_url, :category,
             :sizes_available, :in_stock, :position, :published

  def image_url
    object.image.attached? ? rails_blob_url(object.image) : nil
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
