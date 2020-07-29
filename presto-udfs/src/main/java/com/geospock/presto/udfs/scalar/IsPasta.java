package com.geospock.presto.udfs.scalar;

import com.facebook.presto.spi.function.Description;
import com.facebook.presto.spi.function.ScalarFunction;
import com.facebook.presto.spi.function.SqlType;
import com.facebook.presto.spi.type.StandardTypes;

import io.airlift.slice.Slice;

public class IsPasta
{
    private IsPasta() {}

    @Description("Is it 'pasta'?")
    @ScalarFunction("is_pasta")
    @SqlType(StandardTypes.BOOLEAN)
    public static boolean isPasta(@SqlType(StandardTypes.VARCHAR) Slice string)
    {
        return string.toStringAscii().equalsIgnoreCase("pasta");
    }
}
