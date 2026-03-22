class BandSerializer < ActiveModel::Serializer
  attributes :id, :name, :bio, :logo_url, :background_image_url,
             :primary_color, :secondary_color, :heading_font, :body_font,
             :hero_tagline, :about_content, :cta_title, :cta_subtitle,
             :nav_events, :nav_galleries, :nav_videos, :nav_merch, :nav_contact, :nav_about,
             :footer_tagline, :footer_cta,
             :band_members_header,
             :epk_enabled, :epk_headline, :epk_short_bio, :epk_one_sheet,
             :social_links

  def logo_url
    object.logo.attached? ? rails_blob_url(object.logo) : nil
  end

  def background_image_url
    object.background_image.attached? ? rails_blob_url(object.background_image) : nil
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
