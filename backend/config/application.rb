require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"

Bundler.require(*Rails.groups)

module BandWebsiteApi
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        cors_origins = [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://localhost:5173',   # Vite default
          'http://127.0.0.1:5173',
          ENV['CORS_ORIGIN']
        ].compact
        origins(*cors_origins)
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: true
      end
    end
  end
end
