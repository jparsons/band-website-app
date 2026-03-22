class CreateVideos < ActiveRecord::Migration[7.1]
  def change
    create_table :videos do |t|
      t.string :title, null: false
      t.string :embed_url, null: false
      t.string :thumbnail_url
      t.text :description
      t.integer :position, default: 0
      t.boolean :published, default: true
      
      t.timestamps
    end
    
    add_index :videos, :position
  end
end
