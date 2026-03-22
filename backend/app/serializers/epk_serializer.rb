class EpkSerializer
  def initialize(band:, press_quotes:, releases:, epk_contacts:, technical_rider_sections:, band_members:, events:, videos:, request:)
    @band = band
    @press_quotes = press_quotes
    @releases = releases
    @epk_contacts = epk_contacts
    @technical_rider_sections = technical_rider_sections
    @band_members = band_members
    @events = events
    @videos = videos
    @request = request
  end

  def as_json(_options = {})
    {
      band: band_data,
      press_quotes: serialize_collection(@press_quotes, PressQuoteSerializer),
      releases: serialize_collection(@releases, ReleaseSerializer),
      contacts: serialize_collection(@epk_contacts, EpkContactSerializer),
      technical_rider: serialize_collection(@technical_rider_sections, TechnicalRiderSectionSerializer),
      band_members: serialize_collection(@band_members, BandMemberSerializer),
      upcoming_events: serialize_collection(@events, EventSerializer),
      videos: serialize_collection(@videos, VideoSerializer)
    }
  end

  private

  def band_data
    {
      id: @band.id,
      name: @band.name,
      bio: @band.bio,
      epk_enabled: @band.epk_enabled,
      epk_headline: @band.epk_headline,
      epk_short_bio: @band.epk_short_bio,
      epk_one_sheet: @band.epk_one_sheet,
      logo_url: attachment_url(@band.logo),
      background_image_url: attachment_url(@band.background_image),
      social_links: @band.social_links
    }
  end

  def serialize_collection(collection, serializer_class)
    collection.map do |item|
      serializer_class.new(item, request: @request).as_json
    end
  end

  def attachment_url(attachment)
    return nil unless attachment.attached?
    Rails.application.routes.url_helpers.rails_blob_url(attachment, host: request_host)
  end

  def request_host
    if @request
      "#{@request.protocol}#{@request.host_with_port}"
    else
      "#{Rails.env.production? ? 'https' : 'http'}://#{ENV['HOST'] || 'localhost:3000'}"
    end
  end
end
