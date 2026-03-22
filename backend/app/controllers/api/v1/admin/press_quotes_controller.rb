module Api
  module V1
    module Admin
      class PressQuotesController < ApplicationController
        def index
          press_quotes = PressQuote.ordered
          render json: press_quotes, each_serializer: PressQuoteSerializer
        end

        def show
          press_quote = PressQuote.find(params[:id])
          render json: press_quote, serializer: PressQuoteSerializer
        end

        def create
          press_quote = PressQuote.new(press_quote_params)

          if press_quote.save
            render json: press_quote, serializer: PressQuoteSerializer, status: :created
          else
            render json: { errors: press_quote.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          press_quote = PressQuote.find(params[:id])

          if press_quote.update(press_quote_params)
            render json: press_quote, serializer: PressQuoteSerializer
          else
            render json: { errors: press_quote.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          press_quote = PressQuote.find(params[:id])
          press_quote.destroy
          head :no_content
        end

        private

        def press_quote_params
          params.require(:press_quote).permit(
            :quote, :source, :author, :url, :published_date,
            :position, :published, :featured
          )
        end
      end
    end
  end
end
