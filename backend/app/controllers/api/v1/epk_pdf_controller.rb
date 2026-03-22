module Api
  module V1
    class EpkPdfController < ActionController::Base
      # Skip CSRF since this is an API endpoint
      skip_before_action :verify_authenticity_token

      def show
        @band = Band.instance

        unless @band.epk_enabled
          render json: { error: 'EPK is not available' }, status: :not_found
          return
        end

        @host = "#{request.protocol}#{request.host_with_port}"
        @press_quotes = PressQuote.published.ordered
        @releases = Release.published.ordered
        @epk_contacts = EpkContact.published.ordered
        @technical_rider_sections = TechnicalRiderSection.published.ordered
        @band_members = BandMember.published.ordered
        @events = Event.published.upcoming.limit(10)

        html = render_to_string(
          template: 'epk/pdf',
          layout: 'pdf'
        )

        pdf = Grover.new(html, display_url: @host).to_pdf

        send_data pdf,
                  filename: "#{@band.name.parameterize}-epk.pdf",
                  type: 'application/pdf',
                  disposition: 'attachment'
      end
    end
  end
end
