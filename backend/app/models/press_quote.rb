class PressQuote < ApplicationRecord
  validates :quote, presence: true
  validates :source, presence: true

  scope :published, -> { where(published: true) }
  scope :featured, -> { where(featured: true) }
  scope :ordered, -> { order(position: :asc) }

  after_initialize :set_position, if: :new_record?

  private

  def set_position
    self.position ||= (PressQuote.maximum(:position) || 0) + 1
  end
end
