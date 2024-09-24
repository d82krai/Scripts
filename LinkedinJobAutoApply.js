function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to create a modal for displaying job details
function createModal() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '5%';
    modal.style.left = '5%';
    modal.style.transform = 'translate(-17%, -20%)';
    modal.style.backgroundColor = 'lightyellow';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    modal.style.zIndex = 2147483647;
    modal.style.display = 'none'; // Initially hidden
    document.body.appendChild(modal);
    return modal;
}

// Function to click each job item with a random delay
async function clickJobItemsWithDelay(jobItemsArray) {
    const modal = createModal();

    // Recursive function to click items one by one
    async function clickNext(index) {
        // Check if index is within the bounds of the array
        if (index < jobItemsArray.length) {
            // Scroll to the job item to ensure it's in view
            jobItemsArray[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
			jobItemsArray[index].focus();

            // Focus and display the job item details
            modal.innerHTML = `<h2>Job Details</h2><p>Applying Job:<br/>${jobItemsArray[index].innerText}</p>`;
			console.log('//----------------------------------------------');
			console.log(`Job: ${jobItemsArray[index].innerText}`);
            modal.style.display = 'block'; // Show the modal

			await wait(3000);
            
                // Click the current job item
                jobItemsArray[index].click();
                //console.log(`Clicked item ${index + 1}`);
				
				await wait(2000);
				
				// Applying Job
				if(document.getElementsByClassName('jobs-apply-button').length > 0)
				{
					try
					{
						document.getElementsByClassName('jobs-apply-button')[0].click();
						await wait(3000);
						
						var applyButtons = document.getElementsByClassName('artdeco-button--primary');
						for (const item of applyButtons) {
							// Extract the text content and find the percent value
							const textContent = item.textContent;
							if(textContent.trim() == 'Next')
							{
								// Clicking Next button
								item.click();
								
								await wait(3000);
								
								// Select all elements with the specified class
								const items = document.querySelectorAll(".display-flex > .t-black--light");

								// Convert the NodeList to an array and filter for items containing "%"
								const filteredItems = Array.from(items).filter(item => item.textContent.includes("%"));

								// Initialize an array to store the percent values
								const percentValues = [];

								// Loop through the filtered items and extract the percent values
								filteredItems.forEach(item => {
									// Extract the text content and find the percent value
									const textContent = item.textContent;
									const percentValue = textContent.match(/[\d.]+%/); // Match numeric value followed by '%'

									// If a match is found, push it to the array
									if (percentValue) {
										percentValues.push(percentValue[0]); // Get the matched value
									}
								});

								// Log the percent values
								console.log(`Wizard current progress is: ${percentValues[0]};`);

								// 
								if(percentValues[0] == "50%")
								{
									console.log('This job I can apply...');
									//artdeco-button--primary
									document.getElementsByClassName('artdeco-button--primary')[0].click();
									
									await wait(2000);
									//artdeco-button--primary
									document.getElementsByClassName('artdeco-button--primary')[0].click();
								}
								else
								{
									console.log('Not applying this job as it require user inputs.');
									document.getElementsByClassName('artdeco-modal__dismiss')[0].click();
									await wait(500);
									
									document.getElementsByClassName('artdeco-modal__confirm-dialog-btn')[0].click();
									
									await wait(2000);
								}
								
								
							}
						};
					}
					catch(err)
					{
						console.error(err);
					}
					
				}
				else{
					console.log('Already applied');
				}
				
				// Hide the modal
				modal.style.display = 'none';

				// Check if more items need to be loaded
				loadMoreItems().then(() => {
					// Refresh the jobItemsArray after loading more items
					jobItemsArray = Array.from(document.querySelectorAll(".job-card-container__link"));
					clickNext(index + 1);
				});

                
        } else {
            console.log("All items have been clicked.");
            modal.remove(); // Remove modal after all items are clicked
        }
    }

    // Function to scroll down and load more items
    function loadMoreItems() {
        return new Promise((resolve) => {
            // Scroll down
            window.scrollBy(0, window.innerHeight);
            setTimeout(() => {
                resolve();
            }, 2000); // Wait for 2 seconds for new items to load
        });
    }

    // Start clicking from the first item
    clickNext(0);
}

// Example usage
var jobItems = document.querySelectorAll(".job-card-container__link");
var jobItemsArray = Array.from(jobItems);
clickJobItemsWithDelay(jobItemsArray);
