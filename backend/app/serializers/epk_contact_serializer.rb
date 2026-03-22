class EpkContactSerializer < ActiveModel::Serializer
  attributes :id, :contact_type, :name, :email, :phone, :company, :territory,
             :position, :published, :created_at, :updated_at
end
