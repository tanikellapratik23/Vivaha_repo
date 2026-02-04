// Song suggestions for different wedding moments and cultures

export interface SongSuggestion {
  title: string;
  artist: string;
  genre: string;
  mood: string;
  culturalContext?: string;
}

export const songSuggestions: Record<string, SongSuggestion[]> = {
  'Ceremony': [
    { title: 'Canon in D', artist: 'Pachelbel', genre: 'Classical', mood: 'Elegant' },
    { title: 'A Thousand Years', artist: 'Christina Perri', genre: 'Pop', mood: 'Romantic' },
    { title: 'Marry You', artist: 'Bruno Mars', genre: 'Pop', mood: 'Upbeat' },
    { title: 'All of Me', artist: 'John Legend', genre: 'R&B', mood: 'Emotional' },
    { title: 'Perfect', artist: 'Ed Sheeran', genre: 'Pop', mood: 'Romantic' },
    { title: 'Ave Maria', artist: 'Schubert', genre: 'Classical', mood: 'Sacred' },
    { title: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Classic Rock', mood: 'Joyful' },
    { title: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', genre: 'Bollywood', mood: 'Emotional', culturalContext: 'Indian' },
    { title: 'Tum Hi Ho', artist: 'Arijit Singh', genre: 'Bollywood', mood: 'Romantic', culturalContext: 'Indian' },
    { title: 'At Last', artist: 'Etta James', genre: 'Jazz', mood: 'Timeless' },
  ],
  
  'Cocktail Hour': [
    { title: 'Come Away With Me', artist: 'Norah Jones', genre: 'Jazz', mood: 'Relaxed' },
    { title: 'Thinking Out Loud', artist: 'Ed Sheeran', genre: 'Pop', mood: 'Romantic' },
    { title: 'Isn\'t She Lovely', artist: 'Stevie Wonder', genre: 'Soul', mood: 'Upbeat' },
    { title: 'The Girl from Ipanema', artist: 'Stan Getz', genre: 'Bossa Nova', mood: 'Sophisticated' },
    { title: 'Moon River', artist: 'Audrey Hepburn', genre: 'Jazz', mood: 'Elegant' },
    { title: 'La Vie En Rose', artist: 'Édith Piaf', genre: 'French', mood: 'Romantic' },
    { title: 'What a Wonderful World', artist: 'Louis Armstrong', genre: 'Jazz', mood: 'Joyful' },
    { title: 'Channa Mereya', artist: 'Arijit Singh', genre: 'Bollywood', mood: 'Melancholic', culturalContext: 'Indian' },
    { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', genre: 'Latin', mood: 'Passionate', culturalContext: 'Latin' },
    { title: 'Beyond', artist: 'Leon Bridges', genre: 'Soul', mood: 'Smooth' },
  ],

  'Reception Entrance': [
    { title: 'Crazy in Love', artist: 'Beyoncé', genre: 'Pop/R&B', mood: 'Energetic' },
    { title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', genre: 'Pop', mood: 'Upbeat' },
    { title: 'Happy', artist: 'Pharrell Williams', genre: 'Pop', mood: 'Joyful' },
    { title: 'Celebration', artist: 'Kool & The Gang', genre: 'Funk', mood: 'Festive' },
    { title: 'Best Day of My Life', artist: 'American Authors', genre: 'Indie Pop', mood: 'Uplifting' },
    { title: 'Gallan Goodiyaan', artist: 'Yashita Sharma', genre: 'Bollywood', mood: 'Celebratory', culturalContext: 'Indian' },
    { title: 'Shake It Off', artist: 'Taylor Swift', genre: 'Pop', mood: 'Fun' },
    { title: 'September', artist: 'Earth, Wind & Fire', genre: 'Funk', mood: 'Festive' },
    { title: 'Lovely Day', artist: 'Bill Withers', genre: 'Soul', mood: 'Upbeat' },
    { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', genre: 'Funk', mood: 'Energetic' },
  ],

  'First Dance': [
    { title: 'Thinking Out Loud', artist: 'Ed Sheeran', genre: 'Pop', mood: 'Romantic' },
    { title: 'Perfect', artist: 'Ed Sheeran', genre: 'Pop', mood: 'Romantic' },
    { title: 'At Last', artist: 'Etta James', genre: 'Jazz', mood: 'Timeless' },
    { title: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', genre: 'Classic', mood: 'Romantic' },
    { title: 'All of Me', artist: 'John Legend', genre: 'R&B', mood: 'Emotional' },
    { title: 'Make You Feel My Love', artist: 'Adele', genre: 'Pop', mood: 'Heartfelt' },
    { title: 'A Thousand Years', artist: 'Christina Perri', genre: 'Pop', mood: 'Romantic' },
    { title: 'The Way You Look Tonight', artist: 'Frank Sinatra', genre: 'Jazz', mood: 'Classic' },
    { title: 'Tum Hi Ho', artist: 'Arijit Singh', genre: 'Bollywood', mood: 'Romantic', culturalContext: 'Indian' },
    { title: 'Endless Love', artist: 'Lionel Richie & Diana Ross', genre: 'R&B', mood: 'Romantic' },
  ],

  'Dinner': [
    { title: 'Come Away With Me', artist: 'Norah Jones', genre: 'Jazz', mood: 'Relaxed' },
    { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', genre: 'Jazz', mood: 'Elegant' },
    { title: 'Unchained Melody', artist: 'The Righteous Brothers', genre: 'Classic', mood: 'Romantic' },
    { title: 'What a Wonderful World', artist: 'Louis Armstrong', genre: 'Jazz', mood: 'Joyful' },
    { title: 'Beyond', artist: 'Leon Bridges', genre: 'Soul', mood: 'Smooth' },
    { title: 'The Way You Look Tonight', artist: 'Frank Sinatra', genre: 'Jazz', mood: 'Classic' },
    { title: 'L-O-V-E', artist: 'Nat King Cole', genre: 'Jazz', mood: 'Charming' },
    { title: 'Sway', artist: 'Michael Bublé', genre: 'Jazz', mood: 'Romantic' },
    { title: 'Tere Bina', artist: 'A.R. Rahman', genre: 'Bollywood', mood: 'Melodic', culturalContext: 'Indian' },
    { title: 'Unforgettable', artist: 'Nat King Cole', genre: 'Jazz', mood: 'Timeless' },
  ],

  'Dancing': [
    { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', genre: 'Funk', mood: 'Energetic' },
    { title: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', genre: 'Pop', mood: 'Upbeat' },
    { title: 'September', artist: 'Earth, Wind & Fire', genre: 'Funk', mood: 'Festive' },
    { title: 'Don\'t Stop Me Now', artist: 'Queen', genre: 'Rock', mood: 'Energetic' },
    { title: 'Dancing Queen', artist: 'ABBA', genre: 'Disco', mood: 'Fun' },
    { title: 'Shut Up and Dance', artist: 'Walk the Moon', genre: 'Indie Rock', mood: 'Upbeat' },
    { title: '24K Magic', artist: 'Bruno Mars', genre: 'Funk', mood: 'Party' },
    { title: 'Levitating', artist: 'Dua Lipa', genre: 'Pop', mood: 'Danceable' },
    { title: 'Gallan Goodiyaan', artist: 'Yashita Sharma', genre: 'Bollywood', mood: 'Celebratory', culturalContext: 'Indian' },
    { title: 'Bom Diggy', artist: 'Zack Knight', genre: 'Bollywood', mood: 'Energetic', culturalContext: 'Indian' },
    { title: 'Cheap Thrills', artist: 'Sia', genre: 'Pop', mood: 'Party' },
    { title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', genre: 'Pop', mood: 'Upbeat' },
  ],

  'Cake Cutting': [
    { title: 'Sugar', artist: 'Maroon 5', genre: 'Pop', mood: 'Sweet' },
    { title: 'How Sweet It Is', artist: 'James Taylor', genre: 'Folk Rock', mood: 'Joyful' },
    { title: 'Brown Sugar', artist: 'The Rolling Stones', genre: 'Rock', mood: 'Upbeat' },
    { title: 'Pour Some Sugar on Me', artist: 'Def Leppard', genre: 'Rock', mood: 'Energetic' },
    { title: 'Cake by the Ocean', artist: 'DNCE', genre: 'Pop', mood: 'Fun' },
    { title: 'Happy', artist: 'Pharrell Williams', genre: 'Pop', mood: 'Joyful' },
  ],

  'Bouquet Toss': [
    { title: 'Single Ladies', artist: 'Beyoncé', genre: 'Pop/R&B', mood: 'Empowering' },
    { title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper', genre: 'Pop', mood: 'Fun' },
    { title: 'Man! I Feel Like a Woman', artist: 'Shania Twain', genre: 'Country Pop', mood: 'Energetic' },
    { title: 'Independent Women', artist: 'Destiny\'s Child', genre: 'R&B', mood: 'Empowering' },
    { title: 'Respect', artist: 'Aretha Franklin', genre: 'Soul', mood: 'Powerful' },
  ],

  'Send Off': [
    { title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', genre: 'Soul', mood: 'Upbeat' },
    { title: 'I\'m a Believer', artist: 'The Monkees', genre: 'Pop Rock', mood: 'Joyful' },
    { title: 'Don\'t Stop Believin\'', artist: 'Journey', genre: 'Rock', mood: 'Uplifting' },
    { title: 'All You Need Is Love', artist: 'The Beatles', genre: 'Classic Rock', mood: 'Joyful' },
    { title: 'Good Riddance (Time of Your Life)', artist: 'Green Day', genre: 'Alternative', mood: 'Reflective' },
    { title: 'Forever Young', artist: 'Rod Stewart', genre: 'Rock', mood: 'Nostalgic' },
    { title: 'Closing Time', artist: 'Semisonic', genre: 'Alternative Rock', mood: 'Bittersweet' },
  ],

  'Pre-Wedding Event': [
    { title: 'Happy', artist: 'Pharrell Williams', genre: 'Pop', mood: 'Joyful' },
    { title: 'Celebration', artist: 'Kool & The Gang', genre: 'Funk', mood: 'Festive' },
    { title: 'Good Life', artist: 'OneRepublic', genre: 'Pop', mood: 'Uplifting' },
    { title: 'Best Day of My Life', artist: 'American Authors', genre: 'Indie Pop', mood: 'Uplifting' },
    { title: 'Lovely Day', artist: 'Bill Withers', genre: 'Soul', mood: 'Upbeat' },
    { title: 'Dil Dhadakne Do', artist: 'Priyanka Chopra', genre: 'Bollywood', mood: 'Celebratory', culturalContext: 'Indian' },
    { title: 'Mehendi Hai Rachne Wali', artist: 'Lata Mangeshkar', genre: 'Bollywood', mood: 'Traditional', culturalContext: 'Indian' },
  ],
};

export const getPlaylistSuggestions = (eventType: string): SongSuggestion[] => {
  return songSuggestions[eventType] || [];
};

export const generateSpotifyPlaylistUrl = (playlistName: string, songs: Array<{title: string, artist: string}>): string => {
  // Generate a search URL to help users create the playlist in Spotify
  const searchQuery = songs.map(s => `${s.title} ${s.artist}`).join(' OR ');
  return `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}`;
};

export const generateAppleMusicPlaylistUrl = (playlistName: string, songs: Array<{title: string, artist: string}>): string => {
  // Generate a search URL to help users create the playlist in Apple Music
  const searchQuery = songs.map(s => `${s.title} ${s.artist}`).join(', ');
  return `https://music.apple.com/search?term=${encodeURIComponent(searchQuery)}`;
};

export const generatePlaylistTextFile = (playlistName: string, songs: Array<{title: string, artist: string, album?: string}>): string => {
  let content = `${playlistName}\n`;
  content += `${'='.repeat(playlistName.length)}\n\n`;
  
  songs.forEach((song, index) => {
    content += `${index + 1}. ${song.title} - ${song.artist}`;
    if (song.album) content += ` (${song.album})`;
    content += '\n';
  });
  
  content += `\n\nTotal Songs: ${songs.length}\n`;
  content += `\nCreated with Vivaha - Your Perfect Wedding Planner\n`;
  
  return content;
};

export const downloadPlaylistFile = (playlistName: string, songs: Array<{title: string, artist: string, album?: string}>) => {
  const content = generatePlaylistTextFile(playlistName, songs);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${playlistName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_playlist.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
