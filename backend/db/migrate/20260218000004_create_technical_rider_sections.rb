class CreateTechnicalRiderSections < ActiveRecord::Migration[7.0]
  def change
    create_table :technical_rider_sections do |t|
      t.string :title, null: false
      t.text :content
      t.integer :position, default: 0
      t.boolean :published, default: true
      t.timestamps
    end
  end
end
