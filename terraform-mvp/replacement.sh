#!/bin/bash

# Check the number of parameters
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <directory_path> <replacement_json>"
    exit 1
fi

# Check if the directory exists
if [ ! -d "$1" ] && [ !  -f "$1" ]; then
    echo "Error: Directory or file '$1' not found."
    exit 1
fi

if [ -d "$1" ]; then
    echo "$1 is a directory"
elif [ -f "$1" ]; then
    echo "$1 is a file"
else
    echo "$1 is neither a file nor a directory"
    exit 1
fi

# Get the directory path and JSON string parameters
directory=$1
json_string=$2

# Traverse all files in the directory and its subdirectories starting with index-
# Parse the JSON string
replace_pairs=$(echo "$json_string" | jq -r 'to_entries[] | "\(.key)=\(.value)"')

# Traverse all files in the directory and its subdirectories starting with index-
if [ -d "$1" ]; then 
    find "$directory" -type f -name 'index-*' | while read -r file; do
        # Check if the file exists
        if [ -f "$file" ]; then
            # Traverse and replace key-value pairs
            while IFS='=' read -r replace_key replace_value; do
                # Check if the file contains the key to be replaced
                if grep -q "$replace_key" "$file"; then
                    # Replace the content in the file
                    if sed -i "s|$replace_key|$replace_value|g" "$file"; then
                        echo "Replaced content in file: $file"
                        echo "key: $replace_key"
                        echo "value: $replace_value"
                    fi
                fi
            done <<< "$replace_pairs"
        fi
    done
fi

if [ -f "$1" ]; then
  while IFS='=' read -r replace_key replace_value; do
        # Check if the file contains the key to be replaced
        if grep -q "$replace_key" "$1"; then
            #   Replace the content in the file
            if sed -i  "s|$replace_key|$replace_value|g" "$1"; then
                echo "Replaced content in file: $1"
                echo "key: $replace_key"
                echo "value: $replace_value"
            fi
        fi
    done <<< "$replace_pairs"  
fi


echo "Replacement complete!"
