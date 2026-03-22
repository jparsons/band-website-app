class BandMember < ApplicationRecord
  has_one_attached :photo

  validates :name, presence: true

  scope :published, -> { where(published: true) }
  scope :ordered, -> { order(position: :asc) }
end
