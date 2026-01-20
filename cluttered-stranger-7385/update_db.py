import json

# Read the db.json file
with open('db.json', 'r') as f:
    data = json.load(f)

# Define color mapping from the colors array in the frontend sidebar
available_colors = ["Maroon", "Black", "Olive", "Multi", "Peach", "Yellow", "Pink", "Green", "Navy", "White", "Blue", "Cream", "Brown"]

# Update each product with gender and proper color field
for idx, product in enumerate(data['products']):
    # Add gender field - alternate between male and female
    if idx % 2 == 0:
        product['gender'] = 'male'
    else:
        product['gender'] = 'female'
    
    # Map the colors array to a single color field from available colors
    if 'colors' in product and len(product['colors']) > 0:
        # Try to match the first color with available colors
        first_color = product['colors'][0]
        matched_color = None
        
        # Try exact match
        if first_color in available_colors:
            matched_color = first_color
        else:
            # Try to find a match by checking if available color is in the product color
            for available in available_colors:
                if available.lower() in first_color.lower():
                    matched_color = available
                    break
        
        # If no match found, default to the first color or a default
        if not matched_color:
            # Map common colors
            color_mapping = {
                'Navy': 'Navy',
                'White': 'White',
                'Black': 'Black',
                'Gray': 'Multi',
                'Grey': 'Multi',
                'Blue': 'Blue',
                'Dark Blue': 'Blue',
                'Light Blue': 'Blue',
                'Beige': 'Cream',
                'Brown': 'Brown',
                'Charcoal': 'Multi',
                'Red': 'Multi',
                'Green': 'Green',
                'Yellow': 'Yellow',
                'Pink': 'Pink',
            }
            matched_color = color_mapping.get(first_color, 'Multi')
        
        product['color'] = matched_color
    else:
        product['color'] = 'Multi'

# Write the updated data back to db.json
with open('db.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Updated {len(data['products'])} products with gender and color fields")
