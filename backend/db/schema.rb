# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_02_18_000005) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "band_members", force: :cascade do |t|
    t.string "name", null: false
    t.string "role"
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_band_members_on_position"
  end

  create_table "bands", force: :cascade do |t|
    t.string "name", null: false
    t.text "bio"
    t.string "primary_color", default: "#000000"
    t.string "secondary_color", default: "#ffffff"
    t.jsonb "social_links", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "heading_font", default: "Inter"
    t.string "body_font", default: "Inter"
    t.string "hero_tagline", default: "Rock your world"
    t.text "about_content"
    t.string "cta_title", default: "Stay Connected"
    t.string "cta_subtitle", default: "Follow us on social media for updates and exclusive content"
    t.string "nav_events", default: "Events"
    t.string "nav_galleries", default: "Galleries"
    t.string "nav_videos", default: "Videos"
    t.string "nav_merch", default: "Merch"
    t.string "nav_contact", default: "Contact"
    t.string "nav_about", default: "About"
    t.string "footer_tagline", default: "Rock the world, one show at a time."
    t.string "footer_cta", default: "Get in touch through our contact page"
    t.string "band_members_header", default: "Band Members"
    t.boolean "epk_enabled", default: true
    t.string "epk_headline"
    t.text "epk_short_bio"
    t.text "epk_one_sheet"
  end

  create_table "contact_messages", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "subject"
    t.text "message", null: false
    t.boolean "read", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_contact_messages_on_created_at"
    t.index ["read"], name: "index_contact_messages_on_read"
  end

  create_table "epk_contacts", force: :cascade do |t|
    t.string "contact_type", null: false
    t.string "name", null: false
    t.string "email"
    t.string "phone"
    t.string "company"
    t.string "territory"
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.string "title", null: false
    t.string "venue", null: false
    t.string "address"
    t.string "city"
    t.string "state"
    t.datetime "date", null: false
    t.time "doors_open"
    t.time "show_starts"
    t.string "ticket_url"
    t.text "description"
    t.boolean "featured", default: false
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["date"], name: "index_events_on_date"
    t.index ["featured"], name: "index_events_on_featured"
  end

  create_table "merchandises", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.decimal "price", precision: 10, scale: 2
    t.string "category"
    t.jsonb "sizes_available", default: []
    t.boolean "in_stock", default: true
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_merchandises_on_category"
    t.index ["position"], name: "index_merchandises_on_position"
  end

  create_table "photo_galleries", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_photo_galleries_on_position"
  end

  create_table "photos", force: :cascade do |t|
    t.bigint "photo_gallery_id", null: false
    t.string "caption"
    t.integer "position", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["photo_gallery_id"], name: "index_photos_on_photo_gallery_id"
    t.index ["position"], name: "index_photos_on_position"
  end

  create_table "press_quotes", force: :cascade do |t|
    t.text "quote", null: false
    t.string "source", null: false
    t.string "author"
    t.string "url"
    t.date "published_date"
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.boolean "featured", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "releases", force: :cascade do |t|
    t.string "title", null: false
    t.string "release_type", null: false
    t.date "release_date"
    t.string "label"
    t.text "description"
    t.string "spotify_url"
    t.string "apple_music_url"
    t.string "bandcamp_url"
    t.string "other_streaming_url"
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "technical_rider_sections", force: :cascade do |t|
    t.string "title", null: false
    t.text "content"
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "role", default: "admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "videos", force: :cascade do |t|
    t.string "title", null: false
    t.string "embed_url", null: false
    t.text "description"
    t.integer "position", default: 0
    t.boolean "published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_videos_on_position"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "photos", "photo_galleries"
end
