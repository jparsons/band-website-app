class ReleaseSerializer < ActiveModel::Serializer
  attributes :id, :title, :release_type, :release_date, :label, :description,
             :spotify_url, :apple_music_url, :bandcamp_url, :other_streaming_url,
             :cover_art_url, :position, :published, :created_at, :updated_at

  def cover_art_url
    object.cover_art.attached? ? rails_blob_url(object.cover_art) : nil
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
