package com.geospock.presto.udfs;

import com.facebook.presto.spi.Plugin;
import com.geospock.presto.udfs.aggregation.AverageBetweenLimits;
import com.google.common.collect.ImmutableSet;
import com.geospock.presto.udfs.scalar.IsPasta;

import java.util.Set;

public class GeoSpockUdfPlugin implements Plugin
{
    @Override
    public Set<Class<?>> getFunctions()
    {
        return ImmutableSet.<Class<?>>builder()
                .add(IsPasta.class)
                .add(AverageBetweenLimits.class)
                .build();
    }
}
