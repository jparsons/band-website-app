module Api
  module V1
    class EpkController < ApplicationController
      skip_before_action :authenticate_admin

      def show
        band = Band.instance

        unless band.epk_enabled
          render json: { error: 'EPK is not available' }, status: :not_found
          return
        end

        epk_data = EpkSerializer.new(
          band: band,
          press_quotes: PressQuote.published.ordered,
          releases: Release.published.ordered,
          epk_contacts: EpkContact.published.ordered,
          technical_rider_sections: TechnicalRiderSection.published.ordered,
          band_members: BandMember.published.ordered,
          events: Event.published.upcoming.limit(10),
          videos: Video.published.ordered.limit(5),
          request: request
        )

        render json: epk_data.as_json
      end
    end
  end
end
