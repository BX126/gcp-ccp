packages_to_install <- c("data.table", "BEDMatrix", "dplyr", "MASS","optparse")

# Loop through each package and install if not already installed
for (pkg in packages_to_install) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    install.packages(pkg)
  }
}