-- Seed realistic Google-style reviews for Elk Novations
-- Run in Supabase SQL Editor

begin;

-- Remove obvious placeholder rows if they exist
delete from google_reviews
where lower(review_text) like '%qqq%'
   or lower(review_text) like '%template%'
   or lower(review_text) like '%lorem ipsum%'
   or lower(author_name) like '%test%';

-- Insert 25 realistic reviews
insert into google_reviews (
  author_name,
  author_initial,
  rating,
  review_text,
  review_date,
  avatar_color,
  sort_order
)
values
  ('Natalie Collins', 'N', 5, 'We hired Elk Novations for a full kitchen refresh and they were excellent from planning to final cleanup. The schedule was clear, the team arrived on time every day, and the finish quality on cabinetry and tile is top notch.', '2 weeks ago', '#1a73e8', 1),
  ('James Howard', 'J', 5, 'Our bathroom renovation came out better than expected. They explained each step, kept the place tidy, and finished within the timeline they promised. Very professional crew.', '3 weeks ago', '#0f9d58', 2),
  ('Emma Brooks', 'E', 5, 'Elk Novations converted our loft into a bright home office. The insulation, lighting, and custom storage made a huge difference. Communication was excellent the whole time.', '1 month ago', '#fbbc05', 3),
  ('Ryan Murphy', 'R', 5, 'Great company to work with. They rebuilt our deck and exterior stairs with better materials than we originally planned, and the final result feels solid and safe.', '1 month ago', '#ea4335', 4),
  ('Sarah Bennett', 'S', 4, 'Very good experience overall. Small delay on one material delivery, but they kept us informed and still wrapped everything up cleanly. The patio now looks fantastic.', '1 month ago', '#7b1fa2', 5),
  ('Daniel Carter', 'D', 5, 'We did a full interior repaint plus trim replacement. The lines are clean, the prep work was careful, and the team treated our home with respect.', '5 weeks ago', '#00897b', 6),
  ('Laura Rivera', 'L', 5, 'Elk Novations handled our basement finishing project and we are extremely happy with the result. Flooring, drywall, and lighting were done to a high standard.', '6 weeks ago', '#ff7043', 7),
  ('Michael Torres', 'M', 5, 'Honest quote, clear contract, and no surprises at the end. They remodeled our guest bathroom and helped us choose practical finishes that still look premium.', '2 months ago', '#5c6bc0', 8),
  ('Sophie Bell', 'S', 5, 'The team built custom built-ins around our fireplace and upgraded the living room lighting. Craftsmanship is excellent and the space feels completely transformed.', '2 months ago', '#43a047', 9),
  ('Andrew Watson', 'A', 5, 'From first site visit to final walkthrough, the project management was strong. They coordinated plumbing and electrical for our laundry room upgrade perfectly.', '2 months ago', '#ef6c00', 10),
  ('Jessica Gray', 'J', 5, 'We used Elk Novations for an extension and they made a complex project feel manageable. Inspections passed smoothly and the new space blends with the old house beautifully.', '2 months ago', '#3949ab', 11),
  ('Thomas Price', 'T', 4, 'Good experience and strong workmanship. We had a couple of minor punch-list items, but they returned quickly and fixed everything without issue.', '2 months ago', '#00838f', 12),
  ('Hannah Cooper', 'H', 5, 'Our old bathroom had recurring moisture issues. They fixed ventilation and waterproofing properly and the tile work is immaculate. Highly recommended.', '3 months ago', '#c2185b', 13),
  ('Ben Kelly', 'B', 5, 'Elk Novations upgraded our flooring across the first floor. The transitions between rooms are clean and the crew kept dust under control better than expected.', '3 months ago', '#6d4c41', 14),
  ('Rachel Morgan', 'R', 5, 'We appreciated how detailed the quote was. Every stage of our kitchen remodel was documented, and the final invoice matched the estimate closely.', '3 months ago', '#039be5', 15),
  ('Oliver James', 'O', 5, 'They renovated our primary suite and improved the layout dramatically. Better storage, better lighting, and better flow. The result feels like a new home.', '3 months ago', '#7cb342', 16),
  ('Nicole Sanders', 'N', 5, 'Very reliable team. They replaced our old windows and improved insulation, and we noticed a difference in comfort right away. Workmanship and cleanup were excellent.', '4 months ago', '#fb8c00', 17),
  ('David Ramirez', 'D', 5, 'Garage conversion turned out great. They handled permitting, framing, electrical, and finishing with no stress on our side. The room is now fully usable year-round.', '4 months ago', '#8e24aa', 18),
  ('Kate Peterson', 'K', 4, 'Friendly, respectful crew and solid final result. The only issue was one rescheduled day due to weather, but they communicated early and stayed on track.', '4 months ago', '#00acc1', 19),
  ('Chris Ward', 'C', 5, 'We hired them for exterior repairs and repainting. Attention to prep and detail was impressive, and the house now looks fresh without losing character.', '4 months ago', '#d81b60', 20),
  ('Anna Foster', 'A', 5, 'Excellent craftsmanship on our new walk-in shower and vanity area. Tile alignment, grout color, and fixture install were all done beautifully.', '5 months ago', '#546e7a', 21),
  ('Matthew Bailey', 'M', 5, 'Elk Novations helped us modernize an older home while preserving original details. Smart recommendations and high-quality execution throughout.', '5 months ago', '#1e88e5', 22),
  ('Charlotte Harris', 'C', 5, 'The team built a great outdoor kitchen and patio zone for us. Drainage and layout planning were clearly done by people who know what they are doing.', '5 months ago', '#2e7d32', 23),
  ('Joshua Richardson', 'J', 5, 'Professional, punctual, and easy to work with. They remodeled our mudroom with custom storage and durable finishes that are perfect for everyday family use.', '6 months ago', '#f4511e', 24),
  ('Emily Williams', 'E', 5, 'We had Elk Novations complete a whole-home refresh before listing. Paint, lighting, and repairs were handled quickly and cleanly. We got multiple compliments at viewings.', '6 months ago', '#5e35b1', 25);

commit;
