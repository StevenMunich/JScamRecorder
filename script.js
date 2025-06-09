document.addEventListener('DOMContentLoaded', function() {


        let mediaRecorder;
        let recordedChunks = [];

        
        // Uncomment the following line to set the camera to user-facing mode (front camera)
        //mediaRecorder.stream.getVideoTracks()[0].applyConstraints({ facingMode: 'user' }); 
        // facingMode: 'enviorment' for rear camera
        
        /* //JUST TO ASK FOR MORE PERMISSIONS
        navigator.geolocation.getCurrentPosition((position) => {
                    console.log('Latitude: ' + position.coords.latitude + ', Longitude: ' + position.coords.longitude);
                }, (error) => {
                    console.error('Error getting location: ', error);
                });
        */
       
        async function startWebcam() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true}); //audio: true
                const video = document.getElementById('webcam');
                video.srcObject = stream;
                video.muted = true; // Mute local playback so sound is not replayed

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = handleDataAvailable;
                mediaRecorder.onstop = handleStop;
            } catch (error) {
                console.error('Error accessing webcam: ', error);
            }
        }

        function handleDataAvailable(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        }

        function handleStop() {
            const blob = new Blob(recordedChunks, {
                type: 'video/webm'
            });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = url;
            downloadLink.download = 'recorded_video.webm';
            downloadLink.style.display = 'block';
            // Enable play button and store URL for playback
            const playBtn = document.getElementById('playRecord');
            playBtn.disabled = false;
            playBtn.dataset.videourl = url;
        }

        document.getElementById('playRecord').addEventListener('click', function() {
            const url = this.dataset.videourl;
            if (!url) return;
            const video = document.getElementById('webcam');
            video.srcObject = null; // Detach live stream
            video.src = url;
            video.muted = false; // Unmute for playback
            video.play();
        });

        document.getElementById('startRecord').addEventListener('click', () => {
            recordedChunks = [];
            mediaRecorder.start();
           
            document.getElementById('startRecord').disabled = true;
            document.getElementById('stopRecord').disabled = false;
        });

        document.getElementById('stopRecord').addEventListener('click', () => {
            mediaRecorder.stop();
            document.getElementById('startRecord').disabled = false;
            document.getElementById('stopRecord').disabled = true;
        });

        window.onload = startWebcam;
});//END DOM ContentLoaded
//END DOMContentLoaded