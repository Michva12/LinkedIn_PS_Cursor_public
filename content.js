// LinkedIn Profile Saver: content script loaded

class LinkedInProfileExtractor {
  constructor() {
    this.profileData = {};
    this.isProcessing = false;
  }

  // Extract profile information from LinkedIn page
  async extractProfileData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Wait for the name element to appear (robust selector)
      await this.waitForElement('h1.text-heading-xlarge, h1');
      
      this.profileData = {
        name: this.extractName(),
        headline: this.extractHeadline(),
        location: this.extractLocation(),
        company: this.extractCurrentCompany(),
        about: this.extractAbout(),
        experience: this.extractExperience(),
        education: this.extractEducation(),
        skills: this.extractSkills(),
        url: window.location.href,
        extractedAt: new Date().toISOString()
      };

      console.log('LinkedIn Profile Saver: Extracted profile data:', this.profileData);
      
      // Send data to background script
      chrome.runtime.sendMessage({
        action: 'saveProfile',
        data: this.profileData
      });

    } catch (error) {
      console.error('LinkedIn Profile Saver: Error extracting profile data:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Wait for an element to appear on the page
  waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  // Extract name from profile (robust selector)
  extractName() {
    const nameElement = document.querySelector('h1.text-heading-xlarge') || document.querySelector('h1');
    return nameElement ? nameElement.textContent.trim() : '';
  }

  // Extract headline/title (updated selector)
  extractHeadline() {
    const headlineElement = document.querySelector('.text-body-medium.break-words');
    return headlineElement ? headlineElement.textContent.trim() : '';
  }

  // Extract location (updated selector)
  extractLocation() {
    const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
    return locationElement ? locationElement.textContent.trim() : '';
  }

  // Extract current company (fallback: first experience entry)
  extractCurrentCompany() {
    const exp = this.extractExperience();
    return exp.length > 0 ? exp[0].company : '';
  }

  // Extract about section (updated selector)
  extractAbout() {
    const aboutElement = document.querySelector('section.pv-about-section [data-test-about-section]') || document.querySelector('section[aria-label="About"] .pv-shared-text-with-see-more span');
    return aboutElement ? aboutElement.textContent.trim() : '';
  }

  // Extract experience (robust for new layout)
  extractExperience() {
    const experienceSection = document.querySelector('section[id*=experience]');
    if (!experienceSection) return [];
    const experienceElements = experienceSection.querySelectorAll('li');
    const experiences = [];
    experienceElements.forEach(element => {
      const titleElement = element.querySelector('span[aria-hidden="true"]');
      const companyElement = element.querySelector('span.t-14.t-normal');
      const durationElement = element.querySelector('.t-14.t-normal.t-black--light');
      if (titleElement) {
        experiences.push({
          title: titleElement.textContent.trim(),
          company: companyElement ? companyElement.textContent.trim() : '',
          duration: durationElement ? durationElement.textContent.trim() : ''
        });
      }
    });
    return experiences;
  }

  // Extract education (robust for new layout)
  extractEducation() {
    const educationSection = document.querySelector('section[id*=education]');
    if (!educationSection) return [];
    const educationElements = educationSection.querySelectorAll('li');
    const education = [];
    educationElements.forEach(element => {
      const schoolElement = element.querySelector('span[aria-hidden="true"]');
      const degreeElement = element.querySelector('.t-14.t-normal');
      const yearElement = element.querySelector('.t-14.t-normal.t-black--light');
      if (schoolElement) {
        education.push({
          school: schoolElement.textContent.trim(),
          degree: degreeElement ? degreeElement.textContent.trim() : '',
          year: yearElement ? yearElement.textContent.trim() : ''
        });
      }
    });
    return education;
  }

  // Extract skills (robust for new layout)
  extractSkills() {
    const skillElements = document.querySelectorAll('span.pvs-entity__skill-name');
    const skills = [];
    skillElements.forEach(element => {
      skills.push(element.textContent.trim());
    });
    return skills;
  }
}

// Initialize the extractor when the page loads
const extractor = new LinkedInProfileExtractor();

// Extract profile data when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => extractor.extractProfileData(), 2000);
  });
} else {
  setTimeout(() => extractor.extractProfileData(), 2000);
}

// Also extract when URL changes (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => extractor.extractProfileData(), 2000);
  }
}).observe(document, { subtree: true, childList: true });