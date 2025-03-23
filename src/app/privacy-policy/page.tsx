
import Head from "next/head";

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - Manifest AI</title>
                <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your data." />
            </Head>

            <div className="my-30 min-h-screen bg-gray-900 text-white p-6 md:p-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-purple-400 mb-6">Privacy Policy</h1>
                    <p className="text-lg text-gray-300">
                        Last Updated: 23rd March 2025
                    </p>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">1. Introduction</h2>
                        <p className="text-gray-300 mt-2">
                            Welcome to Manifest AI! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your data when you use our application.
                        </p>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">2. Data We Collect</h2>
                        <ul className="list-disc list-inside mt-2 text-gray-300">
                            <li><strong>Personal Information:</strong> Name, email address (for authentication).</li>
                            <li><strong>Usage Data:</strong> How you interact with the app (tasks completed, time spent, preferences).</li>
                            <li><strong>Google Calendar Data:</strong> If you connect your Google Calendar, we access schedule details to personalize your productivity plan.</li>
                        </ul>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">3. How We Use Your Data</h2>
                        <ul className="list-disc list-inside mt-2 text-gray-300">
                            <li>To generate your personalized productivity schedule.</li>
                            <li>To provide insights and analytics for better time management.</li>
                            <li>To enhance user experience with AI-driven suggestions.</li>
                            <li>To sync with third-party services (Google Calendar).</li>
                            <li>To improve our app through analytics and feedback.</li>
                        </ul>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">4. How We Protect Your Data</h2>
                        <p className="text-gray-300 mt-2">
                            We use industry-standard security measures such as **Supabase authentication, encrypted data storage, and secure API communication** to protect your information.
                        </p>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">5. Third-Party Services</h2>
                        <p className="text-gray-300 mt-2">
                            We may use third-party services (Google Calendar API, Supabase) to provide features. These services have their own privacy policies, and we recommend reviewing them.
                        </p>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">6. Your Rights</h2>
                        <p className="text-gray-300 mt-2">
                            Depending on your location, you have rights over your data, including:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-gray-300">
                            <li>Accessing the data we store about you.</li>
                            <li>Requesting deletion of your account and data.</li>
                            <li>Updating or correcting your personal details.</li>
                            <li>Opting out of non-essential data collection.</li>
                        </ul>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">7. Data Retention</h2>
                        <p className="text-gray-300 mt-2">
                            We store your data as long as you use our service. If you delete your account, your data will be permanently erased within 30 days.
                        </p>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">8. Cookies & Tracking</h2>
                        <p className="text-gray-300 mt-2">
                            We may use cookies or local storage to enhance the user experience. You can control these settings in your browser.
                        </p>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">9. Changes to this Policy</h2>
                        <p className="text-gray-300 mt-2">
                            We may update this Privacy Policy from time to time. If there are major changes, we will notify you via email or in-app notification.
                        </p>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-purple-300">10. Contact Us</h2>
                        <p className="text-gray-300 mt-2">
                            If you have any questions about our Privacy Policy, please contact us at <a href="mailto:aroradivyam3@gmail.com" className="text-purple-400 underline">aroradivyam3@gmail.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}

