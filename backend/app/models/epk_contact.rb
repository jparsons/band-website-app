class EpkContact < ApplicationRecord
  CONTACT_TYPES = %w[booking press management licensing].freeze

  validates :contact_type, presence: true, inclusion: { in: CONTACT_TYPES }
  validates :name, presence: true

  scope :published, -> { where(published: true) }
  scope :ordered, -> { order(position: :asc) }
  scope :by_type, ->(type) { where(contact_type: type) }

  after_initialize :set_position, if: :new_record?

  private

  def set_position
    self.position ||= (EpkContact.maximum(:position) || 0) + 1
  end
end
