class EventSerializer < ActiveModel::Serializer
  attributes :id, :title, :venue, :address, :city, :state, :date, 
             :doors_open, :show_starts, :ticket_url, :description, 
             :featured, :published, :created_at, :updated_at
end
