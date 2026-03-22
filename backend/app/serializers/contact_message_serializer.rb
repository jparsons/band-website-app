class ContactMessageSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :subject, :message, :read, :created_at
end
