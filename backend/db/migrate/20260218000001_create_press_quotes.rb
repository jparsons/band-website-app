class CreatePressQuotes < ActiveRecord::Migration[7.0]
  def change
    create_table :press_quotes do |t|
      t.text :quote, null: false
      t.string :source, null: false
      t.string :author
      t.string :url
      t.date :published_date
      t.integer :position, default: 0
      t.boolean :published, default: true
      t.boolean :featured, default: false
      t.timestamps
    end
  end
end
