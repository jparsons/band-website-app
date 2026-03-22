Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Public routes
      get 'band', to: 'band#show'
      resources :events, only: [:index, :show]
      resources :galleries, only: [:index, :show]
      resources :videos, only: [:index]
      resources :merchandise, only: [:index, :show]
      resources :band_members, only: [:index]
      resources :releases, only: [:index]
      post 'contact', to: 'contact#create'

      # EPK routes
      get 'epk', to: 'epk#show'
      get 'epk/pdf', to: 'epk_pdf#show'
      
      # Auth routes
      post 'auth/login', to: 'auth/auth#login'
      post 'auth/logout', to: 'auth/auth#logout'
      get 'auth/verify', to: 'auth/auth#verify'
      
      # Admin routes
      namespace :admin do
        patch 'band', to: 'band#update'

        resources :events
        resources :galleries do
          resources :photos, only: [:create]
        end
        resources :photos, only: [:update, :destroy]
        resources :videos
        resources :merchandise
        resources :messages, only: [:index, :update, :destroy]
        resources :users
        resources :band_members

        # EPK management
        resources :press_quotes
        resources :releases
        resources :epk_contacts
        resources :technical_rider_sections
      end
    end
  end
  
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
