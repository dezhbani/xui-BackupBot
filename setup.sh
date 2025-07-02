#!/bin/bash

# Function to check if a command exists
command_exists () {
    type "$1" &> /dev/null ;
}

# Function to install a specific version of Node.js using nvm
install_node_with_nvm () {
    echo "Installing nvm (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    
    # Load nvm into the current shell session
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    echo "Installing the latest LTS version of Node.js..."
    nvm install --lts
    nvm use --lts

    echo "Node.js installation complete."
}

# Install Git if it's not installed
if command_exists git; then
    echo "Git is already installed."
else
    echo "Git is not installed. Installing Git..."
    
    # Update package list and install Git
    if command_exists apt-get; then
        sudo apt-get update
        sudo apt-get install -y git
    elif command_exists yum; then
        sudo yum install -y git
    elif command_exists brew; then
        brew install git
    else
        echo "Unsupported package manager. Please install Git manually."
        exit 1
    fi
    
    echo "Git installation complete."
fi

# Check if an SSH key already exists
if [ -f ~/.ssh/id_ed25519.pub ]; then
    echo "SSH key already exists. Skipping key generation."
else
    # Prompt for the user's GitHub email
    read -p "Enter your GitHub email: " email

    # Generate a new SSH key
    ssh-keygen -t ed25519 -C "$email"

    # Start the SSH agent in the background
    eval "$(ssh-agent -s)"

    # Add the SSH private key to the SSH agent
    ssh-add ~/.ssh/id_ed25519

    echo "SSH key generated and added to the SSH agent."
fi

# Display the public key and provide instructions
echo "Copy the following SSH key and add it to your GitHub account (https://github.com/settings/keys):"
echo
cat ~/.ssh/id_ed25519.pub
echo
read -p "After adding the SSH key to your GitHub account, press [Enter] to continue."

# Create a new directory for the bot project
read -p "Enter the name of the project folder to create: " project_name
mkdir "$project_name"
cd "$project_name" || exit

# Clone the GitHub repository using SSH
echo "Cloning the repository from GitHub..."
git clone git@github.com:dezhbani/xui-BackupBot.git .

echo "Git repository cloned into the $project_name folder."

# Check Node.js version and install/update if necessary
if command_exists node; then
    node_version=$(node -v)
    echo "Current Node.js version: $node_version"

    # Check if Node.js version is less than 14
    if [[ "$node_version" < "v14" ]]; then
        echo "Node.js version is below 14.0.0. Upgrading Node.js..."
        install_node_with_nvm
    else
        echo "Node.js version is sufficient."
    fi
else
    echo "Node.js is not installed. Installing Node.js..."
    install_node_with_nvm
fi

# Load nvm environment (in case it was installed just now)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install pm2 globally
if command_exists pm2; then
    echo "pm2 is already installed."
else
    echo "Installing pm2..."
    npm install -g pm2
    echo "pm2 installation complete."
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Start the project with pm2
echo "Starting the project with pm2..."
pm2 start index.js --name "$project_name"  # اگر فایل ورودی متفاوت است جایگزین کن

echo "Setup complete! Your project is now running with pm2."
