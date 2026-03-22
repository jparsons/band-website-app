class AddFooterContentToBands < ActiveRecord::Migration[7.1]
  def change
    add_column :bands, :footer_tagline, :string, default: 'Rock the world, one show at a time.'
    add_column :bands, :footer_cta, :string, default: 'Get in touch through our contact page'
  end
end
