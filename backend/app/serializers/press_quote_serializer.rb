class PressQuoteSerializer < ActiveModel::Serializer
  attributes :id, :quote, :source, :author, :url, :published_date,
             :position, :published, :featured, :created_at, :updated_at
end
