class AddCustomizableTextToBands < ActiveRecord::Migration[7.1]
  def change
    add_column :bands, :hero_tagline, :string, default: 'Rock your world'
    add_column :bands, :about_content, :text
    add_column :bands, :cta_title, :string, default: 'Stay Connected'
    add_column :bands, :cta_subtitle, :string, default: 'Follow us on social media for updates and exclusive content'
  end
end
