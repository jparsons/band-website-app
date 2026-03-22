class AddFontsToBands < ActiveRecord::Migration[7.1]
  def change
    add_column :bands, :heading_font, :string, default: 'Inter'
    add_column :bands, :body_font, :string, default: 'Inter'
  end
end
