class TechnicalRiderSectionSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :attachment_url, :attachment_filename,
             :position, :published, :created_at, :updated_at

  def attachment_url
    object.attachment.attached? ? rails_blob_url(object.attachment) : nil
  end

  def attachment_filename
    object.attachment.attached? ? object.attachment.filename.to_s : nil
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
