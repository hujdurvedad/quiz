async function fetchLeaderboard() {
    try {
        const profileResponse = await fetch('https://quiz-be-zeta.vercel.app/out/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        const profileData = await profileResponse.json();

        const currentPlayerName = document.getElementById('current-player-name');
        const currentPlayerPoints = document.getElementById('current-player-points');

        if (profileData) {
            currentPlayerName.textContent = profileData.username || 'Unknown';
            currentPlayerPoints.textContent = `${profileData.bestScore || 0} bodova`;
        }

        const leaderboardResponse = await fetch('https://quiz-be-zeta.vercel.app/leaderboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        const leaderboardData = await leaderboardResponse.json();

        if (Array.isArray(leaderboardData)) {
            const leaderboardContainer = document.getElementById('leaderboard-container');
            leaderboardContainer.innerHTML = '';

            const topPlayers = leaderboardData.slice(0, 5);
            topPlayers.forEach((player, index) => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player';

                if (index === 0) {
                    playerDiv.style.boxShadow = 'white 0 0 10px 1px';
                }

                playerDiv.innerHTML = `
                    <div class="player-info">
                        <p class="player-num">#${index + 1}</p>
                        <p class="name">${player.username}</p>
                    </div>
                    <p class="points">${player.bestScore} bodova</p>
                `;
                leaderboardContainer.appendChild(playerDiv);
            });
        }
    } catch (error) {
        console.error('Greška prilikom učitavanja leaderboarda:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchLeaderboard);
} else {
    fetchLeaderboard();
}
