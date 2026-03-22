class CreateEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :events do |t|
      t.string :title, null: false
      t.string :venue, null: false
      t.string :address
      t.string :city
      t.string :state
      t.datetime :date, null: false
      t.time :doors_open
      t.time :show_starts
      t.string :ticket_url
      t.text :description
      t.boolean :featured, default: false
      t.boolean :published, default: true
      
      t.timestamps
    end
    
    add_index :events, :date
    add_index :events, :featured
  end
end
