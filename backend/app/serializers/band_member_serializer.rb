class BandMemberSerializer < ActiveModel::Serializer
  attributes :id, :name, :role, :photo_url, :position, :published, :created_at, :updated_at

  def photo_url
    object.photo.attached? ? rails_blob_url(object.photo) : nil
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
