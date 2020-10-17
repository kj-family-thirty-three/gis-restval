sudo apt update
# Install nodeenv for node virtual environments
sudo apt-get install -y nodeenv
# Create virtual environment with specific node version
nodeenv --prebuilt -n 12.19.0 --npm=6.14.8 env

# Append .bashrc-gis to .bashrc
echo '# GIS useful aliases\nsource '$PWD'/.bashrc-gis' >> ~/.bashrc
# Append .bashrc-gis to .zshrc If exists
echo '# GIS useful aliases\nsource '$PWD'/.bashrc-gis' >> ~/.zshrc 
# Source bashrc-gis for current terminal
. $PWD/.bashrc-gis
