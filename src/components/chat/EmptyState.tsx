import { MessageSquare } from 'lucide-react';

const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold">Start Your Study Session</p>
            <p className="text-sm max-w-md">Upload a document using the form below. Akili will generate a summary and quiz, then you can start asking questions.</p>
        </div>
    );
};

export default EmptyState;