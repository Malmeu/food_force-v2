import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

const SkillsList = ({ skills, title = 'Compétences requises' }) => {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills.map((skill, index) => (
          <Chip key={index} label={skill} variant="outlined" />
        ))}
      </Box>
    </Box>
  );
};

export default SkillsList;
