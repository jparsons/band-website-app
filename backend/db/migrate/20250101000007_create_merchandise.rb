class CreateMerchandise < ActiveRecord::Migration[7.1]
  def change
    create_table :merchandises do |t|
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2
      t.string :image_url
      t.string :category
      t.jsonb :sizes_available, default: []
      t.boolean :in_stock, default: true
      t.integer :position, default: 0
      t.boolean :published, default: true
      
      t.timestamps
    end
    
    add_index :merchandises, :category
    add_index :merchandises, :position
  end
end
