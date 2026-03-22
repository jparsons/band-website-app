class CreateBands < ActiveRecord::Migration[7.1]
  def change
    create_table :bands do |t|
      t.string :name, null: false
      t.text :bio
      t.string :logo_url
      t.string :background_image_url
      t.string :primary_color, default: '#000000'
      t.string :secondary_color, default: '#ffffff'
      t.jsonb :social_links, default: {}
      
      t.timestamps
    end
  end
end
